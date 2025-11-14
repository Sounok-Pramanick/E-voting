import sys
import logging
from twilio.rest import Client

# Logging setup
logging.basicConfig(
    filename="whatsapp_otp.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

# Twilio Credentials
ACCOUNT_SID = "AC63efa8e7abf810ecc1e9af8d7c6f8321"
AUTH_TOKEN = "027bd3702a504798905abef395d2a00c"

# Twilio WhatsApp sender (Sandbox)
WHATSAPP_FROM = "whatsapp:+14155238886"  # Twilio Sandbox number

def send_whatsapp_otp(mobile, otp):
    try:
        client = Client(ACCOUNT_SID, AUTH_TOKEN)

        phone_no = f"whatsapp:+91{mobile}"
        message_body = f"Your e-Voting OTP is: {otp}\nValid for 5 minutes."

        logging.info(f"Sending OTP to {phone_no}")

        client.messages.create(
            body=message_body,
            from_=WHATSAPP_FROM,
            to=phone_no
        )
        
        logging.info("OTP sent successfully")
        print("success")

    except Exception as e:
        logging.error(f"Failed to send OTP: {str(e)}")
        print(f"error: {str(e)}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("error: Requires mobile and OTP arguments")
        sys.exit(1)

    send_whatsapp_otp(sys.argv[1], sys.argv[2])
