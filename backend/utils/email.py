import aiosmtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = os.getenv("EMAIL_USER", "aryankjhaa@gmail.com")
SENDER_PASSWORD = os.getenv("EMAIL_PASS", "gafo clsx axhr hnzv")

async def send_otp_email(to_email: str, otp: str):
    message = EmailMessage()
    message["From"] = SENDER_EMAIL
    message["To"] = to_email
    message["Subject"] = "Your OTP for Account Verification"
    
    body = f"""
    Hello,
    
    Your OTP for account verification is: {otp}
    
    This OTP is valid for 5 minutes.
    
    Regards,
    Project Manager Team
    """
    message.set_content(body)

    try:
        await aiosmtplib.send(
            message,
            hostname=SMTP_SERVER,
            port=SMTP_PORT,
            username=SENDER_EMAIL,
            password=SENDER_PASSWORD,
            use_tls=True
        )
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
