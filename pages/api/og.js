import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "experimental-edge",
};

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "Wicket Labs";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "1200px",
          height: "630px",
        }}
      >
        <p
          style={{
            fontSize: "50px",
          }}
        >
          {title}
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
