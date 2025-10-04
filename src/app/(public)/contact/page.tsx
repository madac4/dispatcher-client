import ContactForm from '@/components/forms/ContactForm';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Award,
  CheckCircle,
  Clock,
  Facebook,
  HeadphonesIcon,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Users,
} from 'lucide-react';

export default function ContactUsPage() {
  return (
    <>
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-primary-50 py-16 overflow-hidden">
        <div className="fluid-container grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <div>
              <Badge className="bg-primary-100 text-primary-800 border-primary-200 mb-4">CONTACT FORM</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
              <p className="text-lg text-gray-600">
                Fill out the form below and our team will get back to you within 24 hours with a personalized solution.
              </p>
            </div>

            <Card className="p-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary to-primary-600 py-6 text-center">
                <h3 className="text-xl font-bold text-white">Get Your Free Quote</h3>
                <p className="text-primary-100">No obligation • Expert consultation • Quick response</p>
              </CardHeader>
              <CardContent className="pb-6">
                <ContactForm />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 mb-4">CONTACT INFORMATION</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Let&apos;s Connect</h2>
              <p className="text-lg text-gray-600 mb-8">
                We&apos;re here to help you navigate the complexities of oversize and overweight transportation. Reach
                out to us through any of these channels.
              </p>
            </div>

            <div className="space-y-4">
              <Card className="p-4 hover:shadow-lg transition-shadow border-l-4 border-l-primary">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900">Phone Support</h3>
                    <p className="text-gray-600 text-sm">Call us for immediate assistance</p>
                    <p className="font-semibold text-primary-600">+373 78 410 220</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900">Email Support</h3>
                    <p className="text-gray-600 text-sm">Send us detailed requirements</p>
                    <a href="mailto:clickpermit@gmail.com" className="font-semibold text-blue-600">
                      clickpermit@gmail.com
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-4 hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900">Office Location</h3>
                    <p className="text-gray-600 text-sm">Visit us at our headquarters</p>
                    <p className="font-semibold text-green-600">Chicago, IL</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Business Hours</h3>
                    <p className="text-gray-600 text-sm">When you can reach us</p>
                    <div className="space-y-1 mt-3">
                      <p className="text-sm font-medium text-gray-900">Monday - Friday: 7:00 AM - 7:00 PM CST</p>
                      <p className="text-sm font-medium text-gray-900">Saturday: 8:00 AM - 4:00 PM CST</p>
                      <p className="text-sm font-medium text-gray-900">Sunday: Emergency support only</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-900">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-lg"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-lg"
                >
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-lg"
                >
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="fluid-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-primary-100 text-primary-800 border-primary-200 mb-4">WHY CHOOSE OSOW EXPRESS</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Experience the Difference</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              When you contact us, you&apos;re not just getting a service provider – you&apos;re getting a trusted
              partner committed to your success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quick Response</h3>
              <p className="text-gray-600">Get answers within 2 hours during business hours</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Team</h3>
              <p className="text-gray-600">20+ years of combined experience in transportation</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <HeadphonesIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-600">Emergency support available around the clock</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Proven Results</h3>
              <p className="text-gray-600">50,000+ permits processed successfully</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
