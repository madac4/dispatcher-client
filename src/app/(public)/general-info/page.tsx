'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, FileText, Phone, Ruler, Shield, Weight } from 'lucide-react';
import Link from 'next/link';

export default function GeneralInformationPage() {
  return (
    <>
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `url("/about.jpg")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="fluid-container relative">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="bg-primary-100 text-primary-800 border-primary-200 mb-6">PERMITS</Badge>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-600">
                Low Cost, Fast Turnaround{' '}
              </span>
              and Years of Experience-Best Results in the Industry!
            </h1>

            <p className="text-xl text-white mb-8 max-w-3xl mx-auto leading-relaxed">
              Comprehensive information about oversize, overweight, and superload permits to keep your cargo moving
              legally and safely.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="fluid-container">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">
            Oversize/Overweight Permits
          </h2>

          <Card className="p-8 max-w-5xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed">
              If a commercial vehicle is oversize or overweight, a temporary oversize load permit (also known as a truck
              permit or wide load permit) is needed for it to legally travel.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              In most cases a load is considered an oversize load, or an oversize/overweight load in the U.S. and
              requires a state or county oversize load permit when:
            </p>

            <div className="bg-primary-50 rounded-xl p-8 border-2 border-primary-200 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Ruler className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Height</h4>
                  <p className="text-gray-700">
                    The load’s height exceeds 13’6″ or 14’0” depending on the state or province
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Ruler className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Width</h4>
                  <p className="text-gray-700">The load’s width exceeds 8’6″</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Ruler className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Length</h4>
                  <p className="text-gray-700">The load’s length exceeds varies by state and province</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Weight className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Weight</h4>
                  <p className="text-gray-700">
                    The load’s weight exceeds 80,000 pounds in some states, but this varies by state and province
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-12">
        <div className="fluid-container">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">Superload Permits</h2>

          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="p-8 max-w-5xl mx-auto">
              <p className="text-lg text-gray-700 leading-relaxed">
                Any load exceeding routine state dimensions is classified as a superload, requiring specialized
                planning, permitting, and coordination.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                At CLICKPERMIT, we understand the complexity of superload logistics and offer a dedicated department
                focused exclusively on managing these oversized and overweight transports. Our team provides
                comprehensive route surveys and logistics consulting to ensure your equipment moves safely, efficiently,
                and in full compliance with state and local regulations.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed">
                We work closely with government agencies to secure necessary permits and coordinate all aspects of the
                journey—from origin to destination. When existing infrastructure cannot accommodate your
                load,CLICKPERMIT will identify and propose alternate routes that meet safety and structural
                requirements.
              </p>

              <Card className="p-8 bg-primary-50 border-2 border-primary-200">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    You’ll be promptly notified if your transport requires any of the following:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-11">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📐</span>
                    <span className="text-gray-700 font-medium">Engineering or route surveys</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🚓</span>
                    <span className="text-gray-700 font-medium">Police or pilot escorts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🏗️</span>
                    <span className="text-gray-700 font-medium">Bridge or infrastructure analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">⚡</span>
                    <span className="text-gray-700 font-medium">Utility department coordination</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📝</span>
                    <span className="text-gray-700 font-medium">Custom sketches and documentation</span>
                  </div>
                </div>
              </Card>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-500">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-800 font-medium leading-relaxed">
                    With CLICKPERMIT, you gain a trusted partner committed to delivering safe, timely, and compliant
                    superload transportation—no matter the size or complexity.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-primary-50 to-white max-w-5xl mx-auto border-0 p-8">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Understanding Superloads</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Superloads are exceptionally large loads that generally require more scrutiny and analysis for safe
                    movement. Each state has different dimensions that define a Superload as well as different
                    requirements. Our experienced team is glad to assist with these more intricate movements.
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex items-center justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">
                  <Phone className="w-6 h-6" />
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
