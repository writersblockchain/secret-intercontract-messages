// use crate::error::ContractError;
use cosmwasm_std::{
    entry_point, to_binary, DepsMut, Env, MessageInfo, Response, StdResult, WasmMsg,
};

use crate::counter::CounterExecuteMsg;
use crate::msg::{ExecuteMsg, InstantiateMsg};

#[entry_point]
pub fn instantiate(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> StdResult<Response> {
    Ok(Response::default())
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::Increment {
            contract,
            code_hash,
        } => try_increment(deps, env, contract, code_hash),
    }
}

pub fn try_increment(
    _deps: DepsMut,
    _env: Env,
    contract: String,
    code_hash: String,
) -> StdResult<Response> {
    let counter_contract = contract.clone();
    let exec_msg = CounterExecuteMsg::Increment { contract };

    let cosmos_msg = WasmMsg::Execute {
        contract_addr: counter_contract,
        code_hash: code_hash,
        msg: to_binary(&exec_msg)?,
        funds: vec![],
    };

    Ok(Response::new()
        .add_message(cosmos_msg)
        .add_attribute("action", "increment"))
}
