# How to Use the Database in events.py


### If using Flask Shell
Note: Process may be different if doing in a .py file, code will be similar but have to run in app context e.g. in routes

```python
from models import db
import datetime

# If the data.sqlite file does not exist, use 
db.create_all() # May similarly use db.drop_all() to remove it

# Example of creating a user and an Event
user = User(id=2, name='Bilal', username='BilalSoCool64') 
event = Event(id=2, name='Pizza Party', date=datetime.date.today(), time=datetime.datetime.now().time(), location='MyHal', description='Fun times await', creator_id=2)

db.session.add(user)
db.session.add(event) # Alternatively could add both at once via db.session.add([user, event])

db.session.commit() # If this fails, you may have to call db.session.rollBack()

# Voila! if nothing went wrong you will see Bilal and his event in your database!
```
