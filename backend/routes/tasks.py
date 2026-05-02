from fastapi import APIRouter, Depends, HTTPException
from models import TaskCreate, TaskInDB, UserInDB, TaskBase, DashboardStats
from dependencies import get_current_active_user, get_admin_user
from database import tasks_collection, projects_collection
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=TaskInDB)
async def create_task(task: TaskCreate, current_user: UserInDB = Depends(get_admin_user)):
    try:
        proj_id = ObjectId(task.project_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid Project ID")
        
    project = await projects_collection.find_one({"_id": proj_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    task_dict = task.model_dump()
    task_dict["created_by"] = current_user.id
    task_dict["created_at"] = datetime.utcnow()
    
    result = await tasks_collection.insert_one(task_dict)
    task_dict["_id"] = str(result.inserted_id)
    return TaskInDB(**task_dict)

@router.get("/", response_model=list[TaskInDB])
async def list_tasks(current_user: UserInDB = Depends(get_current_active_user)):
    if current_user.role == "Admin":
        cursor = tasks_collection.find()
    else:
        cursor = tasks_collection.find({"assigned_to": current_user.id})
        
    tasks = await cursor.to_list(length=100)
    return [TaskInDB(**{**t, "_id": str(t["_id"])}) for t in tasks]

@router.get("/dashboard", response_model=DashboardStats)
async def dashboard_stats(current_user: UserInDB = Depends(get_current_active_user)):
    if current_user.role == "Admin":
        query = {}
    else:
        query = {"assigned_to": current_user.id}
        
    tasks = await tasks_collection.find(query).to_list(length=None)
    
    total = len(tasks)
    completed = 0
    pending = 0
    overdue = 0
    now = datetime.utcnow()
    
    for t in tasks:
        if t.get("status") == "Completed":
            completed += 1
        else:
            pending += 1
            if t.get("deadline") and t.get("deadline") < now:
                overdue += 1
                
    return DashboardStats(
        total_tasks=total,
        completed_tasks=completed,
        pending_tasks=pending,
        overdue_tasks=overdue
    )

@router.put("/{task_id}", response_model=TaskInDB)
async def update_task(task_id: str, task: TaskBase, current_user: UserInDB = Depends(get_current_active_user)):
    try:
        obj_id = ObjectId(task_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid Task ID")
        
    existing_task = await tasks_collection.find_one({"_id": obj_id})
    if not existing_task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    if current_user.role != "Admin" and existing_task.get("assigned_to") != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this task")
        
    update_data = task.model_dump(exclude_unset=True)
    await tasks_collection.update_one({"_id": obj_id}, {"$set": update_data})
    
    updated_task = await tasks_collection.find_one({"_id": obj_id})
    return TaskInDB(**{**updated_task, "_id": str(updated_task["_id"])})
