from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
import os
import supabase
from dotenv import load_dotenv

app = FastAPI(title="TerabhAI_TODO API", docs_url="/")

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)


# 0. Signup and Login
class User(BaseModel):
    email: str
    password: str


@app.post("/signup")
def signup(request: User):
    email = request.email
    password = request.password
    _, _ = supabase_client.auth.sign_up({"email": email, "password": password})

    return supabase_client.auth.get_session().access_token


@app.post("/login")
def login(request: User):
    email = request.email
    password = request.password
    data, _ = supabase_client.auth.sign_in_with_password(
        {"email": email, "password": password}
    )

    return supabase_client.auth.get_session().access_token


@app.post("/signout")
def signout():
    supabase_client.auth.sign_out()
    return "Signout Successful"


def userFromToken(token):
    data = supabase_client.auth.get_user(token).model_dump()["user"]
    return data


def userIdFromToken(token):
    return userFromToken(token)["id"]


class TaskCreate(BaseModel):
    token: str
    task: str


# 1. Create
@app.post("/create_task")
def createTask(request: TaskCreate):
    token = request.token
    user_id = userIdFromToken(token)

    task = request.task
    data, _ = (
        supabase_client.table("todos")
        .insert({"user_id": user_id, "task": task})
        .execute()
    )
    return data[1][0]


# 2. Read
class GetTask(BaseModel):
    token: str


@app.post("/get_task")
def getTask(request: GetTask):
    token = request.token
    user_id = userIdFromToken(token)
    data, _ = (
        supabase_client.table("todos")
        .select("*")
        .eq("user_id", user_id)
        .order("inserted_at", desc=False)
        .execute()
    )

    return data[1]


# 2. Update
class TaskUpdate(BaseModel):
    token: str
    task: str
    id: int


@app.put("/update_task")
def updateTask(request: TaskUpdate):
    token = request.token
    user_id = userIdFromToken(token)
    id = request.id
    task = request.task
    data, _ = (
        supabase_client.table("todos")
        .update({"task": task})
        .eq("user_id", user_id)
        .eq("id", id)
        .execute()
    )
    return data[1][0]


# 4. Delete
class TaskDelete(BaseModel):
    token: str
    id: int


@app.delete("/delete_task")
def deleteTask(request: TaskDelete):
    token = request.token
    id = request.id
    user_id = userIdFromToken(token)
    data, _ = (
        supabase_client.table("todos")
        .delete()
        .eq("id", id)
        .eq("user_id", user_id)
        .execute()
    )

    return data[1][0]


# 5. Done
class TaskDone(BaseModel):
    token: str
    id: int


@app.put("/done_task")
def doneTask(request: TaskDone):
    token = request.token
    id = request.id
    user_id = userIdFromToken(token)

    data, _ = (
        supabase_client.table("todos")
        .update({"is_complete": True})
        .eq("user_id", user_id)
        .eq("id", id)
        .execute()
    )
    return data[1][0]


################################ main #######################################

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
