// app/api/socket/route.js

export async function GET(req, res) {
  return SocketHandler(req, res);
}
