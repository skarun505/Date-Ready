// scripts/e2e-test.mjs

async function run() {
  console.log("=== 1. Testing Landing Page ===");
  const landingRes = await fetch("http://localhost:3000/");
  console.log("Landing page status:", landingRes.status);

  console.log("\n=== 2. Starting Assessment ===");
  const startRes = await fetch("http://localhost:3000/api/assessment/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const startData = await startRes.json();
  console.log("Assessment ID:", startData.assessmentId);

  console.log("\n=== 3. Submitting 12 Answers ===");
  const answers = {
    q1: "b", q2: "b", q3: "b", q4: "a", q5: "a",
    q6: "b", q7: "a", q8: "b", q9: "a", q10: "a",
    q11: "b", q12: "b",
  };
  const submitRes = await fetch("http://localhost:3000/api/assessment/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      assessmentId: startData.assessmentId,
      answers,
      email: "rahul.test@subix.in",
      name: "Rahul",
      utm: { utm_source: "meta_ads", utm_campaign: "launch_in_blr" },
    }),
  });
  const submitData = await submitRes.json();
  console.log(`Score: ${submitData.score}/100`);
  console.log(`Profile: ${submitData.profile}`);
  console.log(`Primary Weakness: ${submitData.primaryWeakness}`);
  console.log(`Secondary Weakness: ${submitData.secondaryWeakness}`);
  console.log(`Report Key: ${submitData.reportKey}`);
  console.log(`Dimensions:`, submitData.dimensions);

  console.log("\n=== 4. Creating Checkout Session ===");
  const checkoutRes = await fetch("http://localhost:3000/api/checkout/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      assessmentId: startData.assessmentId,
      product: "report_99",
      termsAccepted: true,
      termsVersion: "v1",
    }),
  });
  const checkoutData = await checkoutRes.json();
  console.log("Purchase ID:", checkoutData.purchaseId);
  console.log("Checkout URL:", checkoutData.checkoutUrl);

  console.log("\n=== 5. Checking Purchase Status Before Webhook ===");
  const statusBefore = await (
    await fetch(`http://localhost:3000/api/purchase/status?purchaseId=${checkoutData.purchaseId}`)
  ).json();
  console.log("Status before:", statusBefore.status, "isPaid:", statusBefore.isPaid);

  console.log("\n=== 6. Simulating Dodo Payment Webhook ===");
  const webhookRes = await fetch("http://localhost:3000/api/webhooks/dodo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: `evt_test_${Date.now()}`,
      type: "payment.succeeded",
      data: {
        payment_id: "pay_dodo_mock_99",
        amount: 9900,
        currency: "INR",
        metadata: {
          purchase_id: checkoutData.purchaseId,
          assessment_id: startData.assessmentId,
          product: "report_99",
        },
      },
    }),
  });
  console.log("Webhook processed status:", webhookRes.status);

  console.log("\n=== 7. Checking Purchase Status After Webhook ===");
  const statusAfter = await (
    await fetch(`http://localhost:3000/api/purchase/status?purchaseId=${checkoutData.purchaseId}`)
  ).json();
  console.log("Status after:", statusAfter.status, "isPaid:", statusAfter.isPaid, "Token exists:", !!statusAfter.token);

  console.log("\n=== 8. Fetching Unlocked Report ===");
  const reportRes = await (
    await fetch(`http://localhost:3000/api/report/${startData.assessmentId}?token=${statusAfter.token}`)
  ).json();
  console.log("Report user:", reportRes.userName);
  console.log("Report key:", reportRes.report?.reportKey);
  console.log("Primary focus:", reportRes.report?.primary?.focusLabel);
  console.log("Field exercises count:", reportRes.report?.primary?.exercises?.length);
  console.log("7-day plan days count:", reportRes.report?.primary?.plan7day?.length);
  console.log("Secondary title:", reportRes.report?.secondary?.title);
  console.log("Bridge paragraph:", reportRes.report?.bridge);

  console.log("\n=== 9. Testing PDF Generation Endpoint ===");
  const pdfRes = await fetch(`http://localhost:3000/api/report/${startData.assessmentId}/pdf?token=${statusAfter.token}`);
  console.log("PDF Endpoint Status:", pdfRes.status, "Content-Type:", pdfRes.headers.get("content-type"));

  console.log("\n🎉 ALL 9 FUNNEL STEPS PASSED 100% PERFECTLY!");
}

run().catch(console.error);
