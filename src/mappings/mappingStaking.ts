import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { Balance, BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from "@polkadot/types";
import BigNumber from "bignumber.js";

import { ParaAccountInfo, Remarked, StakingErapaid, StakingInfo } from "../types";

export async function staking(block: SubstrateBlock): Promise<void> {
    const blockNumber = (
        block.block.header.number as Compact<BlockNumber>
    ).toBigInt();
    const stakingEvents = block.events.filter(
        (e) => e.event.section === "parachainStaking"
    ) as unknown as SubstrateEvent[];

    for (let stakingEvent of stakingEvents) {
        const {
            event: { data, method },
        } = stakingEvent;
        const record = new StakingInfo(
            blockNumber.toString() + "-" + stakingEvent.idx.toString()
        );
        record.block_height = blockNumber;
        record.block_timestamp = block.timestamp;
        record.method = method.toString();
        record.data = data.toString();
        await record.save();
    }

    const result = await api.query.system.account(
        "0x7369626CeE070000000000000000000000000000"
    );
    const balanceRecord = new ParaAccountInfo(blockNumber.toString());

    balanceRecord.block_height = blockNumber;
    balanceRecord.block_timestamp = block.timestamp;
    balanceRecord.free = (result.data.free as Balance)?.toBigInt();
    balanceRecord.reserved = (result.data.reserved as Balance)?.toBigInt();
    balanceRecord.feeFrozen = (result.data.frozen as Balance)?.toBigInt();

    const delegators = await Promise.all(
        [
            "0x80a6E6EE06A0d92F4de767ff1dF3390a9c20D08C",
            "0x2De597AB8bef54Bbd356BE019e90FA3c960FeAAc",
        ].map(async (account) => (await api.query.system.account(account)).data.free)
    ) as unknown as number[];

    // save delegators amount in miscFrozen
    balanceRecord.miscFrozen = delegators.reduce((a, c) => BigInt(a) + BigInt(c), BigInt(0)) as unknown as bigint;

    await balanceRecord.save();
    return;
}

export async function handleStakingErapaid(
    event: SubstrateEvent
): Promise<void> {
    const {
        event: {
            data: [blockNumber, index, number_collators, validator_payout],
        },
    } = event;

    const record = new StakingErapaid(`${blockNumber}-${event.idx.toString()}`);
    const totalIssuance = (await api.query.balances.totalIssuance()).toString();
    const round = (await api.query.parachainStaking.round()).toJSON();
    const staked = (
        await api.query.parachainStaking.staked(
            JSON.parse(JSON.stringify(round)).current
        )
    ).toString();
    const staked_portion = new BigNumber(staked).div(totalIssuance).toNumber();
    const annual_return = new BigNumber(0.05).div(staked_portion).toNumber();
    const par_bond_percent = (
        await api.query.parachainStaking.parachainBondInfo()
    ).toJSON();

    const commission = (
        await api.query.parachainStaking.collatorCommission()
    ).toString();

    const apy = new BigNumber(annual_return)
        .multipliedBy(
            new BigNumber(1)
                .minus(new BigNumber(JSON.parse(JSON.stringify(par_bond_percent)).percent).div(100))
                .minus(new BigNumber(commission).div(1000000000))
        )
        .toString();

    record.event_id = event.idx;
    record.block_height = blockNumber.toString();
    record.block_timestamp = event.block.timestamp;
    record.era_index = index.toString();
    record.validator_payout = (validator_payout as Balance)?.toBigInt();
    record.number_collators = number_collators.toString();
    record.apy = apy;

    await record.save();
}

export async function handleRemarked(event: SubstrateEvent): Promise<void> {
    const blockNumber = event.block.block.header.number.toNumber();

    const {
        event: {
            data: [account, hash],
        },
    } = event;

    const record = new Remarked(`${blockNumber}-${event.idx.toString()}`);

    record.event_id = event.idx;
    record.block_height = blockNumber;
    record.block_timestamp = event.block.timestamp;
    record.account = account.toString();
    record.hash = hash.toString();
    record.result = "";

    await record.save();
}
