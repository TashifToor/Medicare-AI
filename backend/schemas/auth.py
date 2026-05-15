from pydantic import BaseModel , EmailStr

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    
class LoginRequest(BaseModel):
    email:EmailStr
    password:str
    
class TokenResponse(BaseModel):
    access_token:str
    token_type:str="bearer"

class UserResponse(BaseModel):
    id:int
    name:str
    email:EmailStr
    is_active:bool
    model_config = {"arbitrary_types_allowed": True}  # ← yeh add karo

    
    # class Config:
    #     from_attributes:True
        
    
