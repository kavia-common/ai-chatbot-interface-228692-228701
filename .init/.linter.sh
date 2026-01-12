#!/bin/bash
cd /home/kavia/workspace/code-generation/ai-chatbot-interface-228692-228701/frontend_reactjs
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

