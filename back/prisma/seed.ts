import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const manager = [
    "create_permission",
    "update_permission",
    "delete_permission",
    "get_permission",
    "find_permission",

    "create_role",
    "update_role",
    "delete_role",
    "get_role",
    "find_role",

    "update_login_audit",
    "get_login_audit",

    "create_user",
    "update_user",
    "update_users",
    "delete_user",
    "get_user",
    "find_user",
  ];
  const member = [
    "create_user",
    "update_user",
    "delete_user",
    "get_user",
    "get_login_audit"
  ]
  const permissions = await Promise.all(
    manager.map(async (e) => {
      const permission = await prisma.permission.create({
        data: {
          name: e,
        },
      });
      return permission;
    })
  );

  const idsManeger = permissions.map((permission) => permission.id);
  const idsMember = permissions.map((permission) => {
    if (member.includes(permission.name)) {
      return permission.id
    }
  });

  await prisma.role.create({
    data: {
      name: "admin",
      permission: {
        connect: idsManeger.map((id) => ({ id })),
      },
    },
  });
  await prisma.role.create({
    data: {
      name: "member",
      permission: {
        connect: idsMember.map((id) => ({ id })).filter((id) => id.id),
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
