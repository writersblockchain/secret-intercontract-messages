use schemars::JsonSchema;
use secret_toolkit::utils::HandleCallback;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum CounterExecuteMsg {
    Increment { contract: String },
}

impl HandleCallback for CounterExecuteMsg {
    const BLOCK_SIZE: usize = 256;
}
