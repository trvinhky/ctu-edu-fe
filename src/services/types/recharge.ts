export interface Recharge {
    recharge_Id?: string
    recharge_money: number
    recharge_score: number
}

export interface RechargeAll {
    count: number
    recharges: Recharge[]
}