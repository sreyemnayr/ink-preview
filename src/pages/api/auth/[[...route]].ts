import { withIronSessionApiRoute } from "iron-session/next";
import ironOptions from "@/lib/ironOptions";
import { siweApi } from "@randombits/use-siwe/next"

export default withIronSessionApiRoute(siweApi(), ironOptions);