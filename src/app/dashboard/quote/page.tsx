'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Calculator, MapPin, Package } from 'lucide-react'
import { useState } from 'react'

export default function Component() {
  const [dimensions, setDimensions] = useState({
    lengthFt: '',
    lengthIn: '',
    widthFt: '',
    widthIn: '',
    heightFt: '',
    heightIn: '',
    weight: '',
  })

  const [addresses, setAddresses] = useState({
    origin: '',
    destination: '',
  })

  const handleDimensionChange = (field: string, value: string) => {
    setDimensions(prev => ({ ...prev, [field]: value }))
  }

  const handleAddressChange = (field: string, value: string) => {
    setAddresses(prev => ({ ...prev, [field]: value }))
  }

  const handleCalculate = () => {
    console.log('Calculating quote...', { dimensions, addresses })
  }

  return (
    <div className="relative">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calculator className="w-8 h-8 text-orange-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quote Calculator</h1>
        <p className="text-gray-600">Calculate shipping costs for your oversized loads</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Package className="w-5 h-5 mr-2 text-orange-500" />
              Load Dimensions
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <Label className="text-base font-semibold text-gray-900">Overall Length</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className=" flex items-center justify-center">
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={dimensions.lengthFt}
                      onChange={e => handleDimensionChange('lengthFt', e.target.value)}
                      className="h-10 text-center rounded-r-none bg-white font-medium"
                    />
                    <Button
                      variant="outline"
                      className="text-sm border-l-0 rounded-l-none text-gray-600 text-center font-medium"
                    >
                      ft
                    </Button>
                  </div>

                  <div className="flex items-center justify-center">
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={dimensions.lengthIn}
                      onChange={e => handleDimensionChange('lengthIn', e.target.value)}
                      className="h-10 text-center rounded-r-none bg-white font-medium"
                    />
                    <Button
                      variant="outline"
                      className="text-sm border-l-0 rounded-l-none text-gray-600 text-center font-medium"
                    >
                      in
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <Label className="text-base font-semibold text-gray-900">Overall Width</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-center">
                    <Input
                      type="number"
                      placeholder="0"
                      value={dimensions.widthFt}
                      onChange={e => handleDimensionChange('widthFt', e.target.value)}
                      className="h-10 text-center rounded-r-none bg-white font-medium"
                    />
                    <Button
                      variant="outline"
                      className="text-sm border-l-0 rounded-l-none text-gray-600 text-center font-medium"
                    >
                      ft
                    </Button>
                  </div>
                  <div className="flex items-center justify-center">
                    <Input
                      type="number"
                      placeholder="0"
                      value={dimensions.widthIn}
                      onChange={e => handleDimensionChange('widthIn', e.target.value)}
                      className="h-10 text-center rounded-r-none bg-white font-medium"
                    />
                    <Button
                      variant="outline"
                      className="text-sm border-l-0 rounded-l-none text-gray-600 text-center font-medium"
                    >
                      in
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <Label className="text-base font-semibold text-gray-900">Overall Height</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-center">
                    <Input
                      type="number"
                      placeholder="0"
                      value={dimensions.heightFt}
                      onChange={e => handleDimensionChange('heightFt', e.target.value)}
                      className="h-10 text-center rounded-r-none bg-white font-medium"
                    />
                    <Button
                      variant="outline"
                      className="text-sm border-l-0 rounded-l-none text-gray-600 text-center font-medium"
                    >
                      ft
                    </Button>
                  </div>
                  <div className="flex items-center justify-center">
                    <Input
                      type="number"
                      placeholder="0"
                      value={dimensions.heightIn}
                      onChange={e => handleDimensionChange('heightIn', e.target.value)}
                      className="h-10 text-center rounded-r-none bg-white font-medium"
                    />
                    <Button
                      variant="outline"
                      className="text-sm border-l-0 rounded-l-none text-gray-600 text-center font-medium"
                    >
                      in
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 space-y-2">
                <Label className="text-base font-semibold text-gray-900">Overall Weight</Label>
                <div className="flex items-center justify-center">
                  <Input
                    type="number"
                    placeholder="0"
                    value={dimensions.weight}
                    onChange={e => handleDimensionChange('weight', e.target.value)}
                    className="h-10 text-center rounded-r-none bg-white font-medium"
                  />
                  <Button
                    variant="outline"
                    className="text-sm border-l-0 rounded-l-none text-gray-600 text-center font-medium"
                  >
                    Pounds (lbs)
                  </Button>
                </div>
              </div>
            </div>

            {/* <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-blue-900">Dimension Summary</span>
                </div>
                <div className="text-sm text-blue-700">
                  {dimensions.lengthFt || dimensions.lengthIn
                    ? `${dimensions.lengthFt || 0}'${dimensions.lengthIn || 0}" × ${dimensions.widthFt || 0}'${
                        dimensions.widthIn || 0
                      }" × ${dimensions.heightFt || 0}'${dimensions.heightIn || 0}"`
                    : 'Enter dimensions above'}
                  {dimensions.weight && ` • ${dimensions.weight} lbs`}
                </div>
              </div>
            </div> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <MapPin className="w-5 h-5 mr-2 text-orange-500" />
              Route Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="origin" className="text-sm font-medium text-gray-700">
                  Origin Address
                </Label>
                <Input
                  id="origin"
                  placeholder="Enter a location"
                  value={addresses.origin}
                  onChange={e => handleAddressChange('origin', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination" className="text-sm font-medium text-gray-700">
                  Destination Address
                </Label>
                <Input
                  id="destination"
                  placeholder="Enter a location"
                  value={addresses.destination}
                  onChange={e => handleAddressChange('destination', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="h-[480px] bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1635959542742!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Calculator className="w-5 h-5 mr-2 text-orange-500" />
              Route Pricing Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold text-gray-900">State</TableHead>
                    <TableHead className="text-right font-semibold text-gray-900">Oversize</TableHead>
                    <TableHead className="text-right font-semibold text-gray-900">Overweight</TableHead>
                    <TableHead className="text-right font-semibold text-gray-900">Superload</TableHead>
                    <TableHead className="text-right font-semibold text-gray-900">Service Fee</TableHead>
                    <TableHead className="text-right font-semibold text-gray-900">Escort</TableHead>
                    <TableHead className="text-right font-semibold text-gray-900">Distance</TableHead>
                    <TableHead className="text-right font-semibold text-gray-900">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div>
                        New York
                        <div className="flex items-center mt-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">61.00</TableCell>
                    <TableCell className="text-right">0.00</TableCell>
                    <TableCell className="text-right text-gray-500">??</TableCell>
                    <TableCell className="text-right">120.00</TableCell>
                    <TableCell className="text-right">9.00</TableCell>
                    <TableCell className="text-right">1.80</TableCell>
                    <TableCell className="text-right font-semibold">$190.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div>
                        New Jersey
                        <div className="flex items-center mt-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">23.10</TableCell>
                    <TableCell className="text-right">0.00</TableCell>
                    <TableCell className="text-right text-gray-500">??</TableCell>
                    <TableCell className="text-right">120.00</TableCell>
                    <TableCell className="text-right">344.72</TableCell>
                    <TableCell className="text-right">68.94</TableCell>
                    <TableCell className="text-right font-semibold">$487.82</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div>
                        Pennsylvania
                        <div className="flex items-center mt-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">81.00</TableCell>
                    <TableCell className="text-right">0.00</TableCell>
                    <TableCell className="text-right text-gray-500">??</TableCell>
                    <TableCell className="text-right">70.00</TableCell>
                    <TableCell className="text-right">497.65</TableCell>
                    <TableCell className="text-right">199.06</TableCell>
                    <TableCell className="text-right font-semibold">$648.65</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div>
                        Maryland
                        <div className="flex items-center mt-1">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">38.00</TableCell>
                    <TableCell className="text-right">0.00</TableCell>
                    <TableCell className="text-right text-gray-500">??</TableCell>
                    <TableCell className="text-right">120.00</TableCell>
                    <TableCell className="text-right">368.34</TableCell>
                    <TableCell className="text-right">73.67</TableCell>
                    <TableCell className="text-right font-semibold">$526.34</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">District of Columbia</TableCell>
                    <TableCell className="text-right">0.00</TableCell>
                    <TableCell className="text-right">0.00</TableCell>
                    <TableCell className="text-right text-gray-500">??</TableCell>
                    <TableCell className="text-right">0.00</TableCell>
                    <TableCell className="text-right">0.00</TableCell>
                    <TableCell className="text-right">5.90</TableCell>
                    <TableCell className="text-right font-semibold">$0.00</TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow className="bg-orange-50 hover:bg-orange-50">
                    <TableCell className="font-bold text-gray-900 text-lg">Totals</TableCell>
                    <TableCell className="text-right font-bold text-orange-600">$203.10</TableCell>
                    <TableCell className="text-right font-bold text-orange-600">$0</TableCell>
                    <TableCell className="text-right font-bold text-gray-500">??</TableCell>
                    <TableCell className="text-right font-bold text-orange-600">$430.00</TableCell>
                    <TableCell className="text-right font-bold text-orange-600">$1219.71</TableCell>
                    <TableCell className="text-right font-bold text-orange-600">349.4 mi</TableCell>
                    <TableCell className="text-right font-bold text-orange-600 text-xl">$1852.81</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                className="px-8 py-3 text-lg font-medium border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent"
                size="lg"
              >
                Save Quote
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-medium" size="lg">
                Place Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="sticky -mx-6 bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 flex gap-4 items-center justify-end">
        {/* <Button onClick={handleCalculate} variant="outline">
          <Save className="w-5 h-5" />
          Save Quote
        </Button>
        <Button onClick={handleCalculate} variant="outline">
          <Calculator className="w-5 h-5" />
          Place Order
        </Button> */}
        <Button onClick={handleCalculate}>
          <Calculator className="w-5 h-5" />
          Calculate Quote
        </Button>
      </div>
    </div>
  )
}
