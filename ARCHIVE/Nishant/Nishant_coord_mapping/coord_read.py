import csv
import random
final_array = []
coordinate_array = []
randarray = []

with open('country_center_coordinates.csv', 'rb') as csvfile:
     spamreader = csv.reader(csvfile, delimiter=',')
     for row in spamreader:
     	coordinate = []
     	coord = row[1]
     	coord = coord.split(',')
     	coord[0] = coord[0].strip()
     	coord[1] = coord[1].strip()

     	if 'W' in coord[1]:
     		#print(coord[1].rsplit(' ',1))
     		#print((coord[1].split(' ',2)[0].replace(' ','.')))
     		#print (-1 * float(coord[1].split(' ',2)[0].replace(' ','.')))
     		coordinate.append(-1 * float(coord[1].rsplit(' ',1)[0].replace(' ','.')))
     	else:
     		coordinate.append(float(coord[1].rsplit(' ',1)[0].replace(' ','.')))

     	if 'S' in coord[0]:
     		coordinate.append(-1 * float(coord[0].rsplit(' ',1)[0].replace(' ','.')))
     	else:
     		coordinate.append(float(coord[0].rsplit(' ',1)[0].replace(' ','.')))
     
     	coordinate_array.append(coordinate)


for i in range(0, len(coordinate_array)):
	num = random.randint(3,8)
	randarray.append(num)

for i in range(0, len(coordinate_array)):
	element = []
	element.append(coordinate_array[i])
	element.append(randarray[i])
	final_array.append(element)



with open("output.csv", "wb") as csv_file:
        writer = csv.writer(csv_file, delimiter=',')
        stringarray = ["coordinates","randvalues"]
        writer.writerow(stringarray)
        for line in final_array:
        	x_coord = str(line[0][0])
        	y_coord = str(line[0][1])
        	coordstring = x_coord + ',' + y_coord
        	randstring = str(line[1])
        	writestring = []
        	writestring.append(coordstring)
        	writestring.append(randstring)
        	writer.writerow(writestring)

