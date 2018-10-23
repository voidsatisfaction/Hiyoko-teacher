import { TLambdaHttpEvent, response } from "../types";

export const handler = async (event: TLambdaHttpEvent, context, callback) => {
  try {
    console.log(event, context)
    callback(null, response(200, `${process.env.NODE_ENV} is runnning`))
  } catch(error) {
    callback(null, response(500, 'Some error occured'))
  }
  // if (event.path === '/app/arbitrageHeader/check' && event.httpMethod === 'POST') {
  //   try {
  //     // check(callback)
  //     const instantStrategy1 = new InstantStrategy1(0);
  //     const result = await instantStrategy1.checkStartOrIgnore();
  //     if (result.start && result.from && result.to && result.coin && result.budgetId) {
  //       console.log(result);
  //       // lambdaClient.arbitrageExec.start(result.from, result.to, result.coin, result.budgetId);
  //       lambdaClient.arbitrageExec.startInstant(result.from, result.to, result.coin, result.budgetId);
  //       httpClient.slack.sendMessage(channel.autoTrade, options.arbitrageForecastOption(result.budgetId, result.percent!, `${result.from} => ${result.to}`));
  //       callback(null, response(200, 'success'));
  //     } else {
  //       callback(null, response(400, 'No budget to start check result'));
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     callback(null, response(500, 'Error happended. check log'));
  //   }
  // } else { callback(null, response(404, 'Method Error or path error')) }
}

// class HandlerManager {
//   private event: TLambdaHttpEvent
//   private callback: any
//   private pathMethodHandler: any

//   constructor(event: TLambdaHttpEvent, callback: any) {
//     this.event = event
//     this.callback = callback
//     this.pathMethodHandler = {}
//   }

//   private isRegisteredPathMethod(path: string, method: string): boolean {

//   }

//   register(path: string, method: string, handler: () => any) {
//     this.pathMethodHandler[path]
//   }
// }