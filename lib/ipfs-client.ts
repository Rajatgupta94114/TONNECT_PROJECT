import { create } from "ipfs-http-client"

// IPFS client configuration
const ipfsClient = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: `Basic ${Buffer.from(
      `${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}:${process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET}`,
    ).toString("base64")}`,
  },
})

export interface IPFSUploadResult {
  hash: string
  url: string
}

export const uploadToIPFS = async (content: string | File): Promise<IPFSUploadResult> => {
  try {
    let data: any

    if (typeof content === "string") {
      data = Buffer.from(content)
    } else {
      data = content
    }

    const result = await ipfsClient.add(data, {
      pin: true,
      cidVersion: 1,
    })

    return {
      hash: result.cid.toString(),
      url: `https://ipfs.io/ipfs/${result.cid.toString()}`,
    }
  } catch (error) {
    console.error("IPFS upload error:", error)
    throw new Error("Failed to upload to IPFS")
  }
}

export const uploadJSONToIPFS = async (data: object): Promise<IPFSUploadResult> => {
  const jsonString = JSON.stringify(data)
  return uploadToIPFS(jsonString)
}

export const getFromIPFS = async (hash: string): Promise<string> => {
  try {
    const chunks = []
    for await (const chunk of ipfsClient.cat(hash)) {
      chunks.push(chunk)
    }
    return Buffer.concat(chunks).toString()
  } catch (error) {
    console.error("IPFS fetch error:", error)
    throw new Error("Failed to fetch from IPFS")
  }
}

export const uploadImageToIPFS = async (file: File): Promise<IPFSUploadResult> => {
  try {
    const result = await ipfsClient.add(file, {
      pin: true,
      cidVersion: 1,
    })

    return {
      hash: result.cid.toString(),
      url: `https://ipfs.io/ipfs/${result.cid.toString()}`,
    }
  } catch (error) {
    console.error("Image upload error:", error)
    throw new Error("Failed to upload image to IPFS")
  }
}
