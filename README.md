# Hiyoko Sensei

[![Build Status](https://travis-ci.org/voidsatisfaction/Hiyoko-teacher.svg?branch=master)](https://travis-ci.org/voidsatisfaction/Hiyoko-teacher)

Line bot for learning active vocabulary

## Develpment

```sh
sh script/dev.sh # docker setting(mysql, web)
sh script/setup_local_db.sh # execute after dynamoDB container ready

npm run test # test can be possible after turn on the docker compose

aws dynamodb scan --table-name HiyokoActionLogs --endpoint-url http://localhost:18000 # scan local dynamodb HiyokoActionLogs table
```

## Deploy

### core

```sh
npm run deploy_core_prod
```

### mantle

#### staging

```sh
npm run deploy_mantle_dev
```

#### prod

```sh
npm run deploy_mantle_prod
```