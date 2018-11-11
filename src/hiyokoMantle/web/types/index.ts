export type TLambdaHttpEvent = {
  resource: string
  path: string
  httpMethod: string
  headers: object // Header 가 object 형식으로
  queryStringParameters: object | null // queryParams 가 object 형식으로 보임
  pathParameters: string | null // 아직 확인 해본 적이 없음
  stageVariables: string | null // 아직 확인 해본 적이 없음
  requestContext: object // request 정보
  body: any // Post일 경우 String, Get일 경우 null. JSON.parse 등을 사용해야함
  isBase64Encoded: boolean
};

export type TLambdaInvokeEvent = {
  resource: 'InvokeEvent'
  eventType: 'InvokeEvent'
  body: any
};

export type TLambdaResponse = {
  statusCode: number
  headers: object
  body: string
};

export const response = (statusCode: number, body): TLambdaResponse => ({
  statusCode,
  headers: { 'Access-Control-Allow-Origin': '*' },
  body: JSON.stringify(body),
});

export type TLambdaInvokeResponse = {
  success: boolean,
  payload: object | string,
}

export const lambdaResponse = (success: boolean, payload: object | string): TLambdaInvokeResponse => {
  return ({ success, payload });
}