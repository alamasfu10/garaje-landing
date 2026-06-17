---
name: deploy
description: >
  Despliega la app. Se invoca manualmente con /deploy. Corre la suite de tests como
  gate sobre devel; si pasa, hace merge/push a main, que dispara el auto-deploy
  de Vercel. Si algún test falla, NO despliega.
---

# Deploy

El trabajo diario ocurre en `devel`. Vercel escucha la rama `main`: cuando se hace push a `main`, Vercel construye y despliega automáticamente.

El "deploy" consiste en validar `devel` y promoverla a `main`.

## Pasos (en orden, parando ante el primer fallo)

1. **Gate de tests:** ejecuta `npm run test:all`.
   - Si **falla**: para, NO sigas, y reporta qué falló. No hagas push.
2. **Verificación de build:** ejecuta `npm run build`.
   - Si falla: para y reporta.
3. **Lint:** ejecuta `npm run lint`.
   - Si falla: para y reporta.
4. **Commit:** si hay cambios sin commitear en `devel`, haz `git add` de los ficheros relevantes y `git commit` con un mensaje descriptivo. Si no hay cambios, omite este paso.
5. **Push a devel remoto:** ejecuta `git push origin devel`.
   Sincroniza el estado local con el remoto.
6. **Merge a main:** ejecuta `git push origin devel:main`.
   Esto promueve el estado actual de `devel` a `main`, disparando el deploy en Vercel.
7. **Reporta:** confirma que el push se hizo e indica que Vercel está construyendo.
   Recuerda al usuario dónde ver el estado (dashboard de Vercel).

## Reglas
- Nunca hagas push si el gate de tests o el build fallan.
- No despliegues secrets: verifica que `.env.local` está en `.gitignore`.
- El trabajo va siempre en `devel`. Nunca commitees directamente en `main`.
- `main` es solo el trigger de Vercel — se actualiza exclusivamente via `devel:main`.
