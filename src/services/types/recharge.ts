export interface Recharge {
    recharge_Id?: string
    recharge_money: number
    recharge_score: number
}

export interface RechargeAll {
    count: number
    recharges: Recharge[]
}

export interface Payment {
    partnerCode: string
    orderId: string
    requestId: string
    amount: number
    responseTime: number
    message: string
    resultCode: number
    payUrl: string
    shortLink: string
}