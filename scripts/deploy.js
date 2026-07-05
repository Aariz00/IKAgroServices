const { execSync } = require("child_process");
const readline = require("readline");

function run(command) {
    console.log(`\n> ${command}\n`);
    execSync(command, {
        stdio: "inherit"
    });
}

function output(command) {
    return execSync(command, {
        encoding: "utf8"
    }).trim();
}

function currentDateTime() {
    const now = new Date();

    const date = now.toISOString().split("T")[0];

    const time = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

    return `${date} ${time}`;
}

console.clear();

console.log("=======================================");
console.log("      IK AGRO DEPLOYMENT TOOL");
console.log("=======================================\n");

try {

    console.log("Updating asset versions...");
    run("node scripts/version.js");

} catch (err) {

    console.log("\n❌ Version update failed.");
    process.exit(1);

}

const changes = output("git status --porcelain");

if (!changes) {

    console.log("\n✅ Nothing changed. Deployment cancelled.\n");
    process.exit(0);

}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("\nCommit message (Press Enter for auto): ", (message) => {

    if (!message.trim()) {
        message = `Website Update - ${currentDateTime()}`;
    }

    console.log(`\nUsing Commit Message:\n"${message}"\n`);

    try {

        console.log("Adding files...");
        run("git add .");

        console.log("Creating commit...");
        run(`git commit -m "${message}"`);

        console.log("Pushing to GitHub...");
        run("git push origin main");

        console.log("\n=======================================");
        console.log("✅ WEBSITE DEPLOYED SUCCESSFULLY");
        console.log("=======================================\n");

    } catch (err) {

        console.log("\n=======================================");
        console.log("❌ DEPLOYMENT FAILED");
        console.log("=======================================\n");

        console.log(err.message);

    }

    rl.close();

});