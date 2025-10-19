'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  Award,
  CheckCircle,
  Clock,
  FileText,
  Mail,
  MapPin,
  Phone,
  Star,
  Truck,
  Users,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Homepage() {
  return (
    <>
      <section className="relative py-16 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `url("/hero.jpg")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="fluid-container relative">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                5+ Years Experience
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                <Star className="w-3 h-3 mr-1" />
                Trusted by 100+ Companies
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
                <Zap className="w-3 h-3 mr-1" />
                24/7 Support
              </Badge>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-primary">Click Permit</span>
            </h1>

            <div className="text-xl md:text-2xl text-gray-200 mb-6 font-medium">
              Your one-stop solution for all your
            </div>

            <div className="text-2xl md:text-3xl font-bold text-white mb-8">
              <span className="text-primary">Oversize</span> • <span className="text-primary">Overweight</span> •{' '}
              <span className="text-primary">High Value</span>
              <br />
              Permitting
            </div>

            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
              Oversize or Overweight? We&apos;ve Got Your Permits Covered! Navigating the road with heavy or oversized
              loads requires more than horsepower — it demands precision, compliance, and the right permits. Whether
              you&apos;re hauling across one state or coast-to-coast, we streamline the permit process so you can stay
              focused on the road ahead.
            </p>

            <Button size="lg" asChild className="w-fit">
              <Link href="/contact">
                <Mail className="w-5 h-5" />
                Contact US Now
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="fluid-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5+</div>
              <div className="text-gray-600 font-medium">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Permits Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-gray-600 font-medium">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="fluid-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold  mb-4">Precision in Every Detail</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our expert team analyzes every aspect of your load to ensure safe, legal, and efficient transportation.
            </p>
          </div>

          <Image
            src="/overloaded-truck.jpg"
            alt="Technical truck and trailer diagram with precise measurements"
            className="w-full h-auto rounded-2xl"
            width={500}
            height={400}
          />
        </div>
      </section>

      <section className="py-16 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("/grid.svg")`,
          }}
        ></div>

        <div className="fluid-container relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Easy Permit{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary">
                Process
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our streamlined process gets you from inquiry to permit in record time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8 space-y-8">
            {[
              {
                step: 1,
                icon: Users,
                title: 'Account Setup/Login',
                description: 'Create your account or login to get started with our streamlined application process.',
                color: 'from-blue-500 to-blue-600',
              },
              {
                step: 2,
                icon: Mail,
                title: 'Send us a Request',
                description: 'Fill out our simple form and upload any documents that are required for processing.',
                color: 'from-green-500 to-green-600',
              },
              {
                step: 3,
                icon: Phone,
                title: 'Get Your Quote',
                description: 'Our experienced team reviews your request and provides you with a detailed quote.',
                color: 'from-primary to-primary-600',
              },
              {
                step: 4,
                icon: CheckCircle,
                title: 'Let us handle the rest',
                description: 'We take care of everything while you focus on what you do best - moving freight safely.',
                color: 'from-emerald-500 to-emerald-600',
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300 relative`}
                  >
                    <item.icon className="w-10 h-10 text-white" />
                    <div className="absolute -top-3 -right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-sm font-bold ">
                      {item.step}
                    </div>
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg mb-3 group-hover:text-primary-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">
                <Mail className="w-5 h-5" />
                Send us a request
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="fluid-container">
          <div className="text-center mb-10">
            <Badge className="bg-primary-100 text-primary-800 border-primary-200 mb-4">CLICK PERMIT SOLUTIONS</Badge>
            <h2 className="text-4xl md:text-5xl font-bold  mb-6">Professional & Clear</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Consistently fast, precise, and stress-free solutions for all your oversize, overweight, and high-value
              freight needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                icon: FileText,
                title: 'Permits',
                description:
                  "Oversize load regulations require specialized truck routing prior to departure. Our experienced permit analysts handle all paperwork and ensure your load moves safely and legally. Whether routine or complex, we've got you covered.",
                features: ['Multi-state routing', '24/7 processing', 'Expert analysis', 'Legal compliance'],
                color: 'from-blue-500 to-blue-600',
                bgColor: 'from-blue-50 to-blue-100',
              },
              {
                icon: Truck,
                title: 'Superloads',
                description:
                  'When shipments exceed routine oversize dimensions, specialized handling is required. Our highly experienced team manages police escorts, pilot cars, and highway studies to ensure on-time, budget-friendly delivery.',
                features: ['Route surveys', 'Escort coordination', 'Permit management', 'Expert logistics'],
                color: 'from-primary to-primary-600',
                bgColor: 'from-primary-50 to-primary-100',
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 p-0 border-0 overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-br ${service.bgColor} p-8 text-center`}>
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold ">{service.title}</h3>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>

                    <div className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link href="/general-info">
                      <Button className="w-full">
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="fluid-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-blue-100 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                  <Image
                    src="/support.webp"
                    alt="Professional customer service team helping clients"
                    className="w-full h-auto rounded-2xl"
                    width={500}
                    height={400}
                  />
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <Badge className="bg-primary-100 text-primary-800 border-primary-200 mb-4">CLICK PERMIT SUPPORT</Badge>
              <h2 className="text-4xl md:text-5xl font-bold  mb-6">We&apos;re Here to Help You Succeed</h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Click Permit strives to make your experience with OTR permitting, insurance, and superload services as
                seamless as possible. Our experienced professionals are always available to answer questions and provide
                expert consultation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold ">Quick Turnaround</div>
                    <div className="text-sm text-gray-600">Fast processing times</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold ">Expert Team</div>
                    <div className="text-sm text-gray-600">5+ years experience</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold ">Nationwide Coverage</div>
                    <div className="text-sm text-gray-600">All 50 states</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-semibold ">24/7 Support</div>
                    <div className="text-sm text-gray-600">Always available</div>
                  </div>
                </div>
              </div>

              <Button size="lg" asChild>
                <Link href="/contact">
                  <Mail className="w-5 h-5" />
                  Get Expert Help
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold  mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Get answers to the most common questions about our services</p>
          </div>

          <Accordion type="single" collapsible>
            {[
              {
                question: 'WHO NEEDS AN OVERSIZE LOAD PERMIT?',
                answer: `If a commercial vehicle is oversize or overweight, a temporary oversize load permit (also known as a truck permit) is needed for it to legally travel.
				In most cases a load is considered an oversize load and requires a state or county oversize load permit when:
				The load's height exceeds 13'6" or 14'0" depending on the state or province
				The load's width exceeds 8'6"
				The load's length exceeds 48' in some states, but this varies by state and province The load's weight exceeds 80,000 pounds in some states, but this varies by state and province`,
              },
              {
                question: 'WHAT IS THE DIFFERENCE BETWEEN AN OVERSIZE LOAD AND A SUPERLOAD?',
                answer:
                  'When the size - weight, height, length or width - of a load exceeds the standard oversize load permit limits for a specific state, and is not divisible (cannot be broken down), it is considered a superload. Note that superload dimensions vary by state.',
              },
              {
                question: 'HOW DO YOU ORDER OVERSIZE TRUCK PERMITS?',
                answer:
                  'You can contact one of our transportation consultants to order oversize truck permits. Check our contact page for phone numbers and hours. You can also start your permit order online here. Once you are set up as a customer in our system, you can then request access to order your permits through our online permit portal, or directly with an assigned oversize permit agent.',
              },
              {
                question: 'HOW LONG DOES IT TAKE TO GET AN OVERSIZE PERMIT BACK AFTER APPLYING?',
                answer: `The amount of time it takes to get an oversize load permit back after applying for one is based on the permit type and if if the app is for a self issued permit or one that requires review.
States, counties, cities, townships and Indian Reservations can all vary and some self-issue while others do not.
Depending on those factors, a driver can be traveling in as quickly as 1 hour if the permit is self-issuing. In fact, 80-90% of all oversize loads can be obtained in 2-4 hours.
With our relationships with government agencies at Click Permit, we can help maximize turnaround times.`,
              },
              {
                question: 'HOW IS MY ROUTE PLANNED FOR AN OVERSIZE LOAD PERMIT?',
                answer: `There is a lot of restrictive routing required when it comes to an oversize load due to the height, length, width and weight of any given load. As a result, certain highways with oversize restrictions, and areas that must be avoided due to overpasses, underpasses, turning radius and more have to be taken into consideration when route planning for oversize load travel.
The staff at Click Permit & Pilot Cars stays up-to-date on all oversize load restrictions whether it's due to dimensions, construction, holidays or weather. We work hard to find our customers the best route with the shortest distance traveled, helping avoid permit delays. When you work with Click Permit, your drivers will drive fewer miles, saving on fuel and ware and tear on trucks making our nominal service fee worth every penny.`,
              },
              {
                question: 'HOW MANY TRANSPORTATION CONSULTANTS DOES CLICK PERMIT HAVE ON STAFF?',
                answer:
                  'Click Permit has over 75 highly experienced transportation consultants averaging over 10 years experience. We are ready to help with your oversize permits, superload permits and trip & fuel permit needs. We also have a dedicated east and west coast pilot car team.',
              },
            ].map((question, index) => (
              <AccordionItem value={`item-${index + 1}`} key={index}>
                <AccordionTrigger>{question.question}</AccordionTrigger>
                <AccordionContent>{question.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Button
              variant="outline"
              className="border-2 border-primary text-primary-600 hover:bg-primary-50 bg-transparent"
              asChild
            >
              <Link href="/contact">
                Contact Our Experts
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
