RESPONSE = `aws lambda invoke --function-name beta-lambda --cli-binary-format raw-in-base64-out --payload '{ "key": "value" }' repsonse.json`
echo RESPONSE is $REPONSE
