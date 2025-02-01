"use server";

import { nanoid } from "nanoid";
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { parseStringify } from "../utils";

export const createDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  const roomId = nanoid();

  try {
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled",
    };

    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };

    // 👇 This is a server action that will only happen on the server
    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: ["room:write"],
    });
    revalidatePath("/");
    //whenever returning from a server action you should parse and stringify.
    return parseStringify(room);
  } catch (error) {
    console.log(`Error happenend while creating room: ${error}`);
  }
};

export const getDocument = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    // const hasAccsess = Object.keys(room.usersAccesses).includes(userId);

    // if (!hasAccsess) {
    //   throw new Error("You don't have access to this document");
    // }

    return parseStringify(room);
  } catch (error) {
    console.log(`Error happenend while getting room: ${error}`);
  }
};
