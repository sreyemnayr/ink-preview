import clientPromise from "@/lib/mongodb";

export const editions = async (req, res) => {
   try {
       const { tokenId } = req.query;
       const data = JSON.parse(req.body);
       console.log(data)

       const client = await clientPromise;
       const db = client.db("order-of-ink");

       const editions = await db
           .collection("editions")
           .updateOne({_id: tokenId}, {$set: data})

       res.json(editions);
   } catch (e) {
       console.error(e);
       res.json({error: JSON.stringify(e)})
   }
};

export default editions;