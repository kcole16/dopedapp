import os
# from env import VARS

def getenv(key, prod=False):
  val = os.environ.get(key)
  if val:
    return val
  elif os.path.isfile('.env'):
    f = open('.env')
    s = f.read()
    f.close()
    for line in s.strip().split('\n'):
      try:
        k, v = line.split('=')
      except ValueError:
        k = line.split('=')[0]
        v = ''.join(line.split('=')[1::])
      if k == key:
        return v
  return None

# def load_env():
#   f = open('.env')
#   s = f.read()
#   f.close()
#   for line in s.strip().split('\n'):
#       try:
#           k, v = line.split('=')
#       except ValueError:
#           k = line.split('=')[0]
#           v = ''.join(line.split('=')[1::])
#       os.environ[k] = v
#   return None

APP_SECRET=getenv("APP_SECRET")
PRODUCTION=getenv("PRODUCTION")
HAPPY_FOX_KEY=getenv("HAPPY_FOX_KEY")
HAPPY_FOX_PASSWORD=getenv("HAPPY_FOX_PASSWORD")
DATABASE_URL=getenv("DATABASE_URL")