from cryptography.fernet import Fernet


def write_key():
    """
    Generates a key and save it into a file
    """
    key = Fernet.generate_key()
    with open("key.key", "wb") as key_file:
        key_file.write(key)


def load_key():
    """
    Loads the key from the current directory named `key.key`
    """
    try:
        return open("key.key", "rb").read()
    except:
        return False


def encrypt(access_token, key):
    """
    Given a filename (str) and key (bytes), it encrypts the file and write it
    """
    f = Fernet(key)

    # encrypt data
    encrypted_data = f.encrypt(access_token)

    return encrypted_data


def decrypt(encrypted_data, key):
    """
    Given a filename (str) and key (bytes), it decrypts the file and write it
    """
    f = Fernet(key)

    # decrypt data
    decrypted_data = f.decrypt(encrypted_data)

    return decrypted_data
