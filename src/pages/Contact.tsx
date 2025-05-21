import Layout from "@/components/Layout";
import ContactForm from "@/components/ContactForm";
import SocialLinks from "@/components/SocialLinks";

const Contact = () => {
  return (
    <Layout>
      <section className="section">
        <div className="container-lg">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="mb-4">Get In Touch</h1>
              <p className="text-lg text-muted-foreground">
                Have a question or interested in working together? 
                Feel free to reach out through the form below.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
              <div className="md:col-span-3">
                <ContactForm />
              </div>
              
              <div className="md:col-span-2">
                <div className="bg-card p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-4">Connect</h3>
                  <p className="text-muted-foreground mb-6">
                    Prefer to connect on social media or via email? 
                    Find me on these platforms:
                  </p>
                  
                  <SocialLinks className="justify-start" />
                  
                  <div className="mt-8">
                    <h4 className="font-medium mb-2">Email</h4>
                    <p className="text-muted-foreground mb-4">
                      your.email@example.com
                    </p>
                    
                    <h4 className="font-medium mb-2">Based in</h4>
                    <p className="text-muted-foreground">
                      San Francisco, California
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
