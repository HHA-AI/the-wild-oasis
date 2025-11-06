import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");
  if (error) {
    throw new Error("Cabins counld not be loaded");
  }

  return data;
}

// 1. 创建deleteCabin()：选择创建一个函数
export async function deleteCabin(id) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);
  if (error) {
    throw new Error("Cabins counld not be deleted");
  }
}

// // 创建新cabin
// export async function createCabin(newCabin) {
//   //1. 指定image路径：因为创建的新的cabin.image的值实际是存储中的路径名称。
//   //替换/原因是如果路径中有/，会自动创建一层文件夹
//   const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
//     "/",
//     ""
//   );
//   const imagePath = `${supabaseUrl}/storage/v1/object/public/cabins-images/${imageName}`;
//   // https://hbgxbintajhdmlavrwif.supabase.co/storage/v1/object/public/cabins-images/cabin-001.jpg

//   // 2. 创建、插入一个新的cabin，img为存储中的地址，后面需要用到这里的返回的data的id，但是select()默认只返回插入的字段，需要在select()中传入属性字符串设置 .select()
//   const { data, error } = await supabase
//     .from("cabins")
//     .insert([{ ...newCabin, image: imagePath }])
//     .select("*");

//   console.log(data);
//   if (error) {
//     console.log(error);
//     throw new Error("Cabins counld not be created");
//   }

//   // 3. 上传image：实际上上传图片到桶中，在cabin对象中将image地址替换成桶中的地址
//   // Upload file using standard upload
//   const { error: storageError } = await supabase.storage
//     .from("cabins-images")
//     .upload(imageName, newCabin.image);

//   // 3.1 如果照片上传保存，需要删除插入的cabin数据--用插入时返回的data.id，而不是newCabin.id
//   if (storageError) {
//     // deleteCabin(newCabin.id); 不要调用函数删除，会报错误提醒，只希望后台删除，不用提醒
//     // bug:删除时选择的匹配data.id，但是实际返回的data中没有id数据，是否需要先查询id，然后删除，还是选择其他匹配项
//     await supabase.from("cabins").delete().eq("id", data[0].id);
//     console.error(storageError);
//     throw new Error(
//       "Cabin image  counld not be uploaded and the cabin was not created"
//     );
//   }

//   return data[0];
// }

// v-2 编辑表格时传入需要编辑的数据id，创建时则不用传入id
// 分析：
// 编辑-->需要做的是更新表格：1 更新原表的数据；2如果更换了图片，需要重新上传图片（新path） + 如果上传失败用图片，抛出异常  + 上传成功删除原图片
// 创建新表：1. 插入新cabin；2.上传图片 + 上传失败，删除插入的数据

// 合并步骤和语法：1 创建表|更新表 ---是否选择了图片-选择了，更新数据里需要用到imagePath没有不用
//                2 判断是否选择了图片--2.1 否--编辑结束
//                              ----- 2.2 是 上传图片--3.1上传失败：抛出异常--空|删除插入数据---
//                                                    3.2上传成功：删除原图片|空

// const { data, error } = await supabase
//   .from('cabins')
//   .update({ other_column: 'otherValue' })
//   .eq('some_column', 'someValue')
//   .select()

// const { data, error } = await supabase
//   .from("cabins")
//   .insert([{ ...newCabin, image: imagePath }])
//   .select("*");

// 不用分的这么细，整体步骤上可以合并，imagePath可以条件赋值

export async function createEditCabin(newCabin, id) {
  let imagePath = null;
  let imageName = null;
  let shouldUploadImg = false;

  // 判断是否上传了图片:
  // 1)如果上传了图片，新增图片名称和地址信息，
  if (newCabin.image instanceof File) {
    imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "");
    imagePath = `${supabaseUrl}/storage/v1/object/public/cabins-images/${imageName}`;
    shouldUploadImg = true;
  } else if (
    typeof newCabin.image === "string" &&
    newCabin.image?.startsWith?.(supabaseUrl)
  ) {
    // 2） 如果没有上传图片,插入数据时复用之前的url--newCabin.image
    shouldUploadImg = false;
    imagePath = newCabin.image; //复用之前的imagePath
  } else {
    // 3) 其他抛出异常
    throw new Error("Invalid image data:", newCabin.image);
  }

  //1.  创建表|更新表
  // A）创建表
  let query = supabase.from("cabins");
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);
  else query = query.update({ ...newCabin, image: imagePath }).eq("id", id);
  const { data, error } = await query.select();

  if (error) {
    throw new Error("Cabins counld not be created");
  }

  // 2 上传图片：如果没有更新图片，这里的newCabin.image=url地址，上传肯定失败，可以先检测是否有文件，再上传
  if (shouldUploadImg) {
    const { error: storageError } = await supabase.storage
      .from("cabins-images")
      .upload(imageName, newCabin.image);

    // 3 上传失败-->插入数据：删除插入的cabin；抛出错误信息并
    if (storageError) {
      if (!id) {
        await supabase.from("cabins").delete().eq("id", data[0].id);
      }
      console.error(storageError);
      throw new Error(
        "Cabin image  counld not be uploaded and the cabin was not created"
      );
    }
  }
  return data[0];
}
