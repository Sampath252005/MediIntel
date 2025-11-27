from fastapi import APIRouter, Depends, HTTPException, UploadFile,File
from sqlmodel import Session,select
from database import getSession
from dto.skinDto import getSkinData
from mlModel.comp.skinComp import calculate_cancer_progression
from mlModel.skin import process_skin_image
from models.SkinHistory import SkinHistory
from models.Users import Users
from routers.authApi import get_current_user
from typing import List
from datetime import datetime, timezone

router = APIRouter(prefix='/skin',tags=['Skin'])

@router.post("/predict")
async def predict_skin_lesion(file: UploadFile = File(...),session: Session = Depends(getSession),email: str = Depends(get_current_user)):
    try:
        # 1. Read the bytes
        contents = await file.read()
        
        # 2. Pass bytes to the ML Engine
        result = process_skin_image(contents)
        
        # 3. Add filename to the result for reference
        result["filename"] = file.filename
        
        user: Users = session.exec(select(Users).where(Users.email == email)).first()
        skinHis:SkinHistory = SkinHistory(
            diagnosis=result["diagnosis"],
            confidence_score=result["confidence_score"],
            severity_level=result["severity_level"],
            urgency_score=result["urgency_score"],
            recommended_action=result["recommended_action"],
            ai_analysis=result["ai_analysis"],
            user_id=user.id,
            )
        session.add(skinHis)
        session.commit()
        session.refresh(skinHis)
        
        return result

    except Exception as e:
        print(f"Server Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/compare")
async def predict_skin_lesion(old_image: UploadFile = File(...), new_image: UploadFile = File(...)):
    try:
        # 1. Read bytes (IO operation)
        old_bytes = await old_image.read()
        new_bytes = await new_image.read()

        # 2. Call the function (Logic operation)
        result = calculate_cancer_progression(old_bytes, new_bytes)

        # 3. Handle errors based on logic result
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])

        # 4. Return JSON
        return result

    except Exception as e:
        print(f"Server Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/skinHistory")

async def predict_skin_lesion(session: Session = Depends(getSession),email: str = Depends(get_current_user)):
    try:
        user: Users = session.exec(select(Users).where(Users.email == email)).first()
        skinHis: List[SkinHistory] = session.exec(select(SkinHistory).where(SkinHistory.user_id == user.id)).all()
        sH: List[getSkinData] = []
        for skin in skinHis:
            sH.append(getSkinData(
                id = skin.id,
                diagnosis = skin.diagnosis,
                confidence_score = skin.confidence_score,
                severity_level = skin.severity_level,
                urgency_score= skin.urgency_score,
                recommended_action= skin.recommended_action,
                ai_analysis= skin.ai_analysis,
                date_time=skin.date_time
            ))
        
        return sH

    except Exception as e:
        print(f"Server Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
