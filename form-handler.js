// Contact Form Handler with Formspree
// Contact Form Handler (Formspree)
(function () {

    const form = document.getElementById("contactForm");
    const successMessage = document.getElementById("formSuccess");

    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector("button[type='submit']");
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = "Sending...";
        submitBtn.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: {
                    "Accept": "application/json"
                }
            });

            if (response.ok) {
                form.reset();

                successMessage.style.display = "block";

                submitBtn.innerHTML = "Sent ✔";

                setTimeout(() => {
                    successMessage.style.display = "none";
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 4000);

            } else {
                throw new Error("Form submission failed");
            }

        } catch (error) {

            submitBtn.innerHTML = "Error! Try Again";
            submitBtn.disabled = false;

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
            }, 3000);
        }

    });

})();