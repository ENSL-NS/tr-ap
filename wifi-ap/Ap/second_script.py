from selenium import webdriver
import time


video_urls = [
    "https://www.youtube.com/watch?v=Q5sdjwUZrV0&t=118s",
    "https://www.youtube.com/watch?v=hGB-6VAcM6U&list=PLyah27R0n8V6nF7-l9xEQQy-A_SlmI53m&index=5",
    "https://www.youtube.com/watch?v=0sfVmH5_nj4",
    # ajoute autant que nécessaire
]


driver = webdriver.Chrome()

# Ouvre la première vidéo dans l’onglet principal
#driver.get(video_urls[0])
#time.sleep(3)  # laisser le temps de démarrer la lecture

# Ouvre les autres vidéos dans de nouveaux onglets
for url in video_urls:
    driver.execute_script(f"window.open('{url}', '_blank');")
    time.sleep(60)  # petite pause pour charger l’onglet

# Reste sur le premier onglet (les autres tournent aussi en arrière-plan)
driver.switch_to.window(driver.window_handles[0])


print("Vidéos lancées, capture réseau en cours...")
time.sleep(300)

# Ferme tout à la fin
driver.quit()
