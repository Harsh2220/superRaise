import { metadata } from "./../../layout";
import { APP_ID } from "../../../constants/index";
import { NextResponse, NextRequest } from "next/server";
import Bundlr from "@bundlr-network/client";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const bundlr = new Bundlr(
      "http://node2.bundlr.network",
      "matic",
      process.env.PRIVATE_KEY
    );
    await bundlr.ready();
    const tx = await bundlr.upload(JSON.stringify(data), {
      tags: [
        { name: "Content-Type", value: "application/json" },
        { name: "App-Name", value: APP_ID },
      ],
    });
    return NextResponse.json({ uri: `ar://${tx.id}` });
  } catch (error) {
    console.log("eeeeeee", error);
    return NextResponse.json("Something went wrong");
  }
}
