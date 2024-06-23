-- CreateTable
CREATE TABLE "UserAuthentication" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "enabled" BOOLEAN DEFAULT true,
    "salt" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "UserAuthentication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginAudit" (
    "id" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "id_address" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "details" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "userAuthenticationId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PasswordResetRequest" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "user_at" TIMESTAMP(3),
    "user_authentication_id" TEXT
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PermissionToUserAuthentication" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAuthentication_id_key" ON "UserAuthentication"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuthentication_username_key" ON "UserAuthentication"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuthentication_email_key" ON "UserAuthentication"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LoginAudit_id_key" ON "LoginAudit"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetRequest_id_key" ON "PasswordResetRequest"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Role_id_key" ON "Role"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_id_key" ON "Permission"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionToUserAuthentication_AB_unique" ON "_PermissionToUserAuthentication"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionToUserAuthentication_B_index" ON "_PermissionToUserAuthentication"("B");

-- AddForeignKey
ALTER TABLE "UserAuthentication" ADD CONSTRAINT "UserAuthentication_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginAudit" ADD CONSTRAINT "LoginAudit_userAuthenticationId_fkey" FOREIGN KEY ("userAuthenticationId") REFERENCES "UserAuthentication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetRequest" ADD CONSTRAINT "PasswordResetRequest_user_authentication_id_fkey" FOREIGN KEY ("user_authentication_id") REFERENCES "UserAuthentication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToUserAuthentication" ADD CONSTRAINT "_PermissionToUserAuthentication_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToUserAuthentication" ADD CONSTRAINT "_PermissionToUserAuthentication_B_fkey" FOREIGN KEY ("B") REFERENCES "UserAuthentication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
