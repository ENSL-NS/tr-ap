from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import csv
import psutil
import subprocess

video_urls = [
    "https://www.youtube.com/watch?v=Q5sdjwUZrV0&t=118s",
    "https://www.youtube.com/watch?v=hGB-6VAcM6U&list=PLyah27R0n8V6nF7-l9xEQQy-A_SlmI53m&index=5",
    "https://www.youtube.com/watch?v=0sfVmH5_nj4",
    "https://www.youtube.com/watch?v=KIsnISpDO74",
    "https://www.youtube.com/watch?v=1js3tX7Pw7c",
    # ajoute autant que nécessaire
]
# Options Chrome pour éviter le blocage YouTube
chrome_options = Options()
chrome_options.add_argument("--disable-blink-features=AutomationControlled")
chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
chrome_options.add_experimental_option('useAutomationExtension', False)
chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114 Safari/537.36")
chrome_options.add_argument("--start-maximized")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(options=chrome_options)



    
def wait_video_playing(driver):
    """Attend qu un <video> existe et qu’il soit en lecture"""
    video = WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "video"))
    )
    # boucle jusqu a lecture effective
    for _ in range(20):
        is_playing = driver.execute_script(
            "return arguments[0].paused === false && arguments[0].ended === false;", video
        )
        if is_playing:
            print("Vidéo confirmée en lecture")
            return True
        time.sleep(1)
    print("Vidéo trouvée mais pas en lecture")
    return False

for idx, url in enumerate(video_urls):
    #driver.get(url)
    driver.execute_script(f"window.open('{url}', '_blank');")
    driver.switch_to.window(driver.window_handles[-1])
    #wait_video_playing(driver)
    print(f"Vidéo lancée : {url}")
    time.sleep(2)


# Revenir au premier onglet
driver.switch_to.window(driver.window_handles[0])

print("Toutes les vidéos sont en lecture. Capture réseau en cours...")
# Laisser les vidéos jouer pendant 5 minutes

time.sleep(300)

driver.quit()
