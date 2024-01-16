#!/usr/bin/env python3
#-*- codig: utf-8 -*-
import sys
import requests
import json
client_id = "mdyy1cdvly"
client_secret = "32GVEkD8L7xwRoaMnRgGnLbTVZJ87tyo7M6Blt46"
headers = {
    "X-NCP-APIGW-API-KEY-ID": client_id,
    "X-NCP-APIGW-API-KEY": client_secret,
    "Content-Type": "application/json"
}
language = "ko" # Language of document (ko, ja )
model = "news" # Model used for summaries (general, news)
tone = "2" # Converts the tone of the summarized result. (0, 1, 2, 3)
summaryCount = "3" # This is the number of sentences for the summarized document.
url= "https://naveropenapi.apigw.ntruss.com/text-summary/v1/summarize" 
title= "'하루 2000억' 판 커지는 간편송금 시장"
content = "내 친구는 착하고 성실해요. 나를 잘 도와줬던 기억이 나요. 따스한 햇살같은 친구입니다. \n웃는 모습이 이뻐요. 햇살 같은 친구에요. 내가 제일 좋아하는 친구\n언젠가 노란 후드티를 입고 왔는데 잘 어울렸어요. 산뜻한 색이 잘 어울리는 친구인 것 같아요. \n독특한 안경을 꼈던 게 기억나요. 동그란 안경이었는데, 색깔이 분홍색이었어요. 항상 활기차고 활발한 친구라 잘 어울린다고 생각했습니다. \n운동을 정말 잘 해요! 같이 농구를 했는데 정말 잘 가르쳐 줬습니다. 몰입하는 모습이 아름다운 친구에요."
data = {
    "document": {
    "title": title,
    "content" : content
    },
    "option": {
    "language": language,
    "model": model,
    "tone": tone,
    "summaryCount" : summaryCount
    }
}
print(json.dumps(data, indent=4, sort_keys=True))
response = requests.post(url, data=json.dumps(data), headers=headers)
rescode = response.status_code
if(rescode == 200):
    print (response.text)
else:
    print("Error : " + response.text)