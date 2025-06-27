const express = require("express");
const bodyParser = require("body-parser");
const noblox = require("noblox.js");

const app = express();
const PORT = 3000;

// === Hardcoded cookie and group ID ===
const COOKIE = "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_CAEaAhAB.6A64DCABF473E854A6AB4A784149C961B5F7C9FD5105F6777BF756D8B639B04CA7629D693F6C6A8C8A2CF1BE27A9B6D784F8CD025BF46285E011C32C36C513950C34A2604AC6EA4872CED4A096BD06BB1A0BF96467CC43EE73F6D49C0C225FD26462F5E17FA905CFF1F908D796396F876D55B252EE9A81E2F1A66740BE04CD883DD650A6F2D35C59686C0D8706D6A742430904E2F7AE776F0BD2DABE5A813611C4FD179657EFD7B1FA448903AE04BCD6F447B53CC02B3C66DB4EE0331A61DE43041A9E6E24C479E3D637E8BC5C8858F07F01E439E14DA5F045B8C396E96259EC5E8466F75E41D281AF3D5A53DC32150FD9E06D5EF3C85912726704892C595D62C43E72F0A1F3DEC85F725C516AC60207C343FF2009FB1B96CB8831CFF4627A319276103C341B3A557EAADABE91C8D8424568CFEB8F393A12288F10772342C8160509FA9EE331320B3C1F0ED002BDE703B3D1B178AB1D4F89E695EE704FE108ACCFD6C922B56B8AC8E04A6568A01C9CC0E9BFDDD4395C0DC087A605D26886B86ABEAB3791FCE87260BE9090F2C09FCE9CA2FBB17C23FF950286DD302B49A4618BF64AF04181BE5187CC507522354947D099EFBBFCE0DA2FB9AB5948EFCC8F12E0FF185ADB26A81B4AE6C8EDCA06076EA283DC3E0A8D181E0672629D761AAD5D8C6232BC55C597F7C48DC27B307C2CE46467C6793E81F301B23653037D056E6890F199620B7AB5174AE41D89F30F552D62857D5A73A9C6F79C0C47F7F5740910FA44752834D9539EFEC5FA0E1ACD64D274AE999724722323AC563E7FA2DFC6CE5FF2824C71FFE091C6579419EFE15818BB8EA041BC5D806F664FAD44A33AF53F99C5BFE03F00607A4DE4E77131738B101BB942886D27CDC5CB27217A966FA5DEE7B4D034AA8B0C5FE17AAFA26F82D1DE23896A99700E5C84A41720398ABCD14176D76C586ED486659357D970913061341FF21108A01294C154F84772A6975FB64EC432681379CE2F9F546621CAAE2D73CB1FF3635A94DE2E383E83263B3A713DCC1CB11F5D550AAE7ECD2B50D9AE66D9A42089343E39E5C4ADD17E04E060486779E8C07342834D7894C634292B09455D16C32229ADC9B1A54F23C19EAAAEB6137760916E8A11C1BB930BB09892CD725FF92345A273237439B8CBF39228ED23CE8B46651298F360EBBB4F5DCB350B486FD5A060CED72CCFC0CD0555D6133B7F529B8A4A4435FF2945D11E23E6B8E8C5058F8C14837E";  // <-- Replace this!
const GROUP_ID = 34130457;                           // <-- Replace this!

app.use(bodyParser.json());

async function startApp() {
  try {
    const currentUser = await noblox.setCookie(COOKIE);
    console.log(`✅ Logged in as ${currentUser.UserName || currentUser.Username || currentUser.name || "Unknown"}`);

  } catch (err) {
    console.error("❌ Failed to log in with cookie:", err);
    return;
  }

  // Promote endpoint
  app.post("/promote", async (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).send("Missing username.");

    try {
      const id = await noblox.getIdFromUsername(username);
      const result = await noblox.promote(GROUP_ID, id);
      res.status(200).json({ success: true, message: `✅ Promoted ${username} to ${result.newRole.name}` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: "Promotion failed." });
    }
  });

  // Demote endpoint
  app.post("/demote", async (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).send("Missing username.");

    try {
      const id = await noblox.getIdFromUsername(username);
      const result = await noblox.demote(GROUP_ID, id);
      res.status(200).json({ success: true, message: `✅ Demoted ${username} to ${result.newRole.name}` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: "Demotion failed." });
    }
  });

  // Test endpoint
  app.get("/", (req, res) => {
    res.send("✅ Roblox rank server is running.");
  });

  app.listen(PORT, () => {
    console.log(`🌐 Server listening on http://localhost:${PORT}`);
  });
}

startApp();
