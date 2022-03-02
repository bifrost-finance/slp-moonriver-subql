import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { Balance } from "@polkadot/types/interfaces";
import { BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from '@polkadot/types';
import { StakingInfo } from "../types/models/StakingInfo";
import { StakingRewarded } from "../types/models/StakingRewarded";
import { StakingErapaid } from "../types/models/StakingErapaid";

export async function staking(block: SubstrateBlock): Promise<void> {
    const blockNumber = (block.block.header.number as Compact<BlockNumber>).toBigInt();

    const stakingEvents = block.events.filter(e => e.event.section === 'staking') as SubstrateEvent[];
    for (let stakingEvent of stakingEvents) {
        const { event: { data, method } } = stakingEvent;
        const record = new StakingInfo(blockNumber.toString() + '-' + stakingEvent.idx.toString());
        record.block_height = blockNumber;
        record.block_timestamp = block.timestamp;
        record.method = method.toString();
        record.data = data.toString();
        await record.save();
    }
    return;
}

export async function handleStakingRewarded(event: SubstrateEvent): Promise<void> {
    const blockNumber =  event.block.block.header.number.toNumber();

    const { event: { data: [account, balance] } } = event;
    const record = new StakingRewarded(`${blockNumber}-${event.idx.toString()}`);
    record.block_height = blockNumber;
    record.event_id = event.idx;
    record.block_timestamp = event.block.timestamp;
    record.account = account.toString();
    record.balance = (balance as Balance).toBigInt();
    await record.save();
}

export async function handleStakingErapaid(event: SubstrateEvent): Promise<void> {
    const blockNumber =  event.block.block.header.number.toNumber();

    const record = new StakingErapaid(`${blockNumber}-${event.idx.toString()}`);
    const { event: { data: [index, validator_payout, remainder] } } = event;

    record.event_id = event.idx;
    record.block_height = blockNumber;
    record.block_timestamp = event.block.timestamp;
    record.ear_index = index.toString();
    record.validator_payout = (validator_payout as Balance).toBigInt();
    record.remainder = (remainder as Balance).toBigInt();

    await record.save();
}


