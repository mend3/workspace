CONNECTION_STRING=$1
USERNAME=$2
PASSWORD=$3
DATABASE=$4
HOSTNAME=$5

# mongoimport --username $USERNAME--password $PASSWORD --db $DATABASE --uri $CONNECTION_STRING --collection retailers --drop --file /app/s3files.json --jsonArray

# mongodump -username $USERNAME --password $PASSWORD --authenticationDatabase admin --db $DATABASE

# mongo --eval 'db = db.getSiblingDB("'\$DATABASE'"); db.createUser({ user: "'\$USERNAME'", pwd: "'\$PASSWORD'", roles: ["root"]});'

mongorestore --username $USERNAME --password $PASSWORD --uri $CONNECTION_STRING --drop --authenticationDatabase admin dump/
