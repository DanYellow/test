# echo $SECRETS_CONTEXT
# echo "$SECRETS_CONTEXT"
# echo $SECRETS_CONTEXT | jq '.MYSQL_DATABASE'
mysql -u $(echo $SECRETS_CONTEXT | jq '.MYSQL_USER') \
    -p$(echo $SECRETS_CONTEXT | jq '.MYSQL_PASSWORD') \
    -h $(echo $SECRETS_CONTEXT | jq '.MYSQL_SERVER') $(echo $SECRETS_CONTEXT | jq '.MYSQL_DATABASE') < database.sql
# mysql -u $MYSQL_USER -p$MYSQL_PASSWORD -h $MYSQL_SERVER $MYSQL_DATABASE < database.sql
