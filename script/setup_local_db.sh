# mysql setup
mysql -h 127.0.0.1 -u root --port=13306 --database=Hiyoko_core < db/hiyoko.sql

# dynamodb setup
node db/LogDb/setup.js