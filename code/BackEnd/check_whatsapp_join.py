import sys
from twilio.rest import Client

# Read the mobile number from PHP script argument
mobile = sys.argv[1].strip()
formatted_number = f"+91{mobile}"

ACCOUNT_SID = "AC63efa8e7abf810ecc1e9af8d7c6f8321"
AUTH_TOKEN = "027bd3702a504798905abef395d2a00c"

VERIFY_KEYWORD = "join language-prepare"
TWILIO_WHATSAPP = "whatsapp:+14155238886"

client = Client(ACCOUNT_SID, AUTH_TOKEN)

verified = False

try:
    messages = client.messages.list(
        to=TWILIO_WHATSAPP,           # We are reading messages that went TO sandbox number
        limit=50                     # More history for reliability
    )

    for msg in messages:
        if msg.from_ == f"whatsapp:{formatted_number}":
            print(f"Checking: {msg.body}")
            if VERIFY_KEYWORD in msg.body.lower():
                verified = True
                break

    if verified:
        print("FOUND")        # Signal PHP it can proceed
    else:
        print("NOT_FOUND")    # PHP should ask user to send message first

except Exception as e:
    print("ERROR")
    print(str(e))
