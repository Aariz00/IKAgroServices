const { execSync } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function run(command) {
  console.log(`\n> ${command}\n`);

  execSync(command, {
    stdio: "inherit"
  });
}

rl.question("Enter commit message: ", (message) => {

  try {

    // Update asset versions
    run("node scripts/version.js");

    // Stage files
    run("git add .");

    // Commit
    run(`git commit -m "${message}"`);

    // Push
    run("git push origin main");

    console.log("\n✅ Deployment completed successfully.");

  } catch (err) {

    console.log("\n❌ Deployment failed.");
    console.log(err.message);

  }

  rl.close();

});