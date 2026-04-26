const admin = require("firebase-admin")

let db

try {
  if (!admin.apps.length) {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      throw new Error("Missing FIREBASE_SERVICE_ACCOUNT env variable")
    }

    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)

    admin.initializeApp({
      credential: admin.credential.cert({
        ...serviceAccount,
        private_key: serviceAccount.private_key.replace(/\\n/g, "\n"),
      }),
      projectId: serviceAccount.project_id,
    })
  }

  db = admin.firestore()
} catch (err) {
  console.error("FIREBASE INIT ERROR:", err)
}

module.exports = async (req, res) => {
  try {
    const event = req.body

    console.log("EVENT:", event?.type)

    if (event?.type === "checkout.session.completed") {
      const session = event.data.object
      const email = session?.customer_details?.email

      console.log("PAID USER:", email)

      if (!email) {
        console.log("No email found in session")
        return res.status(200).json({ received: true })
      }

      if (!db) {
        console.log("Firestore not initialized")
        return res.status(500).json({ error: "DB not ready" })
      }

      await db.collection("players").doc(email).set(
        { paid: true },
        { merge: true }
      )

      console.log("User saved to Firestore")
    }

    res.status(200).json({ received: true })
  } catch (err) {
    console.error("WEBHOOK ERROR:", err)
    res.status(500).json({ error: "fail" })
  }
}