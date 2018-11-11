# Hiyoko Sensei

Line bot for learning active vocabulary

## Develpment

```sh
sh script/dev.sh # docker setting(mysql, web)

npm run test # test can be possible after turn on the docker compose
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