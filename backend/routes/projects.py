from fastapi import APIRouter, Depends, HTTPException
from models import ProjectCreate, ProjectInDB, UserInDB
from dependencies import get_current_active_user, get_admin_user
from database import projects_collection
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=ProjectInDB)
async def create_project(project: ProjectCreate, current_user: UserInDB = Depends(get_admin_user)):
    project_dict = project.model_dump()
    project_dict["created_by"] = current_user.id
    project_dict["created_at"] = datetime.utcnow()
    
    result = await projects_collection.insert_one(project_dict)
    project_dict["_id"] = str(result.inserted_id)
    return ProjectInDB(**project_dict)

@router.get("/", response_model=list[ProjectInDB])
async def list_projects(current_user: UserInDB = Depends(get_current_active_user)):
    if current_user.role == "Admin":
        cursor = projects_collection.find()
    else:
        cursor = projects_collection.find({"members": current_user.id})
    
    projects = await cursor.to_list(length=100)
    return [ProjectInDB(**{**proj, "_id": str(proj["_id"])}) for proj in projects]

@router.put("/{project_id}", response_model=ProjectInDB)
async def update_project(project_id: str, project: ProjectCreate, current_user: UserInDB = Depends(get_admin_user)):
    try:
        obj_id = ObjectId(project_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid Project ID")
        
    result = await projects_collection.update_one(
        {"_id": obj_id},
        {"$set": project.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
        
    updated_project = await projects_collection.find_one({"_id": obj_id})
    return ProjectInDB(**{**updated_project, "_id": str(updated_project["_id"])})

@router.delete("/{project_id}")
async def delete_project(project_id: str, current_user: UserInDB = Depends(get_admin_user)):
    try:
        obj_id = ObjectId(project_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid Project ID")
        
    result = await projects_collection.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
        
    return {"message": "Project deleted successfully"}
