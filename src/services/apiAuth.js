import supabase, { supabaseUrl } from "./supabase";

export async function signup({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: "",
      },
    },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function getCurrentUser() {
  // 查询本地存储，如果有session会话（token)，再想服务器发送请求，获取user信息，
  // 如果没有，需要登录，
  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log("getSession一次");
  if (!session) return null;
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  console.log("getUser一次");
  if (error) throw new Error(error.message);
  return user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function updateUser({ fullName, password, avatar }) {
  // 1. 更新名称或密码\
  let updateData;
  if (password) updateData = { password };
  if (fullName) updateData = { data: { fullName } };
  const { data, error } = await supabase.auth.updateUser(updateData);
  if (error) throw new Error(error.message);
  // 2. 不更新头像，直接返回
  if (!avatar) return data;
  // 3. 更新头像：头像命名+上传头像+更新头像值
  const fileName = `avator-${data.user.id}-${Math.random()}`;
  const { error: storageError } = supabase.storage
    .from("avatars")
    .upload(fileName, avatar);
  if (storageError) throw new Error(storageError.message);
  const { data: updateUser, error: updateAvatarError } =
    await supabase.auth.updateUser({
      data: {
        avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
      },
    });
  if (updateAvatarError) throw new Error(storageError.message);
  return updateUser;
}
