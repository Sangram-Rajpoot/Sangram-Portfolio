// Contact Form Handler with Formspree
(function () {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('formSuccess');

    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                form.reset();
                successMessage.classList.add('show');
                submitBtn.innerHTML = '<span>Sent!</span>';

                setTimeout(() => {
                    successMessage.classList.remove('show');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 4000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            submitBtn.innerHTML = '<span>Error! Try again</span>';
            submitBtn.disabled = false;

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
            }, 3000);
        }
    });
})();