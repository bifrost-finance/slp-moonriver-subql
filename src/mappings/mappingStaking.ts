import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { Balance, BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from "@polkadot/types";
import {
  StakingBonded,
  StakingChilled,
  StakingErapaid,
  StakingInfo,
  StakingKicked,
  StakingPayoutstarte,
  StakingSlashed,
  StakingUnbonded,
  StakingWithdrawn,
} from "../types";

export async function staking(block: SubstrateBlock): Promise<void> {
  const blockNumber = (
    block.block.header.number as Compact<BlockNumber>
  ).toBigInt();
  const stakingEvents = block.events.filter(
    (e) => e.event.section === "staking"
  ) as SubstrateEvent[];

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
  return;
}

export async function handleStakingErapaid(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();
  const record = new StakingErapaid(`${blockNumber}-${event.idx.toString()}`);
  const {
    event: {
      data: [index, validator_payout, remainder],
    },
  } = event;

  record.event_id = event.idx;
  record.block_height = blockNumber;
  record.block_timestamp = event.block.timestamp;
  record.era_index = index.toString();
  record.validator_payout = (validator_payout as Balance)?.toBigInt();
  record.remainder = (remainder as Balance)?.toBigInt();

  await record.save();
}

export async function handleStakingBonded(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();
  const record = new StakingBonded(`${blockNumber}-${event.idx.toString()}`);
  const {
    event: {
      data: [account, balance],
    },
  } = event;

  record.event_id = event.idx;
  record.block_height = blockNumber;
  record.block_timestamp = event.block.timestamp;
  record.balance = (balance as Balance)?.toBigInt();
  record.account = account.toString();

  await record.save();
}

export async function handleStakinUnbonded(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();
  const record = new StakingUnbonded(`${blockNumber}-${event.idx.toString()}`);
  const {
    event: {
      data: [account, balance],
    },
  } = event;

  record.event_id = event.idx;
  record.block_height = blockNumber;
  record.block_timestamp = event.block.timestamp;
  record.balance = (balance as Balance)?.toBigInt();
  record.account = account.toString();

  await record.save();
}

export async function handleStakingKicked(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();
  const record = new StakingKicked(`${blockNumber}-${event.idx.toString()}`);
  const {
    event: {
      data: [nominator, stash],
    },
  } = event;

  record.event_id = event.idx;
  record.block_height = blockNumber;
  record.block_timestamp = event.block.timestamp;
  record.nominator = nominator.toString();
  record.stash = stash.toString();

  await record.save();
}

export async function handleStakingWithdrawn(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();
  const record = new StakingWithdrawn(`${blockNumber}-${event.idx.toString()}`);
  const {
    event: {
      data: [account, balance],
    },
  } = event;

  record.event_id = event.idx;
  record.block_height = blockNumber;
  record.block_timestamp = event.block.timestamp;
  record.balance = (balance as Balance)?.toBigInt();
  record.account = account.toString();

  await record.save();
}

export async function handleStakingChilled(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();
  const record = new StakingChilled(`${blockNumber}-${event.idx.toString()}`);
  const {
    event: {
      data: [account],
    },
  } = event;

  record.event_id = event.idx;
  record.block_height = blockNumber;
  record.block_timestamp = event.block.timestamp;
  record.account = account.toString();

  await record.save();
}

export async function handleStakingSlashed(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();
  const record = new StakingSlashed(`${blockNumber}-${event.idx.toString()}`);
  const {
    event: {
      data: [account, balance],
    },
  } = event;

  record.event_id = event.idx;
  record.block_height = blockNumber;
  record.block_timestamp = event.block.timestamp;
  record.balance = (balance as Balance)?.toBigInt();
  record.account = account.toString();

  await record.save();
}

export async function handleStakingPayoutstarte(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();
  const record = new StakingPayoutstarte(
    `${blockNumber}-${event.idx.toString()}`
  );
  const {
    event: {
      data: [era_index, account],
    },
  } = event;

  record.event_id = event.idx;
  record.block_height = blockNumber;
  record.block_timestamp = event.block.timestamp;
  record.era_index = era_index.toString();
  record.account = account.toString();

  await record.save();
}
